package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.Asset;
import com.akshara.milap.manufacturing.entity.Customer;
import com.akshara.milap.manufacturing.entity.Engineer;
import com.akshara.milap.manufacturing.entity.ServiceTicket;
import com.akshara.milap.manufacturing.entity.enums.ServicePriority;
import com.akshara.milap.manufacturing.entity.enums.ServiceStatus;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.ServiceTicketRepository;
import com.akshara.milap.util.CodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ServiceTicketService {

    private final ServiceTicketRepository serviceTicketRepository;
    private final CustomerService customerService;
    private final AssetService assetService;
    private final EngineerService engineerService;
    private final CodeGenerator codeGenerator;

    public ServiceTicketService(ServiceTicketRepository serviceTicketRepository,
                                 CustomerService customerService,
                                 AssetService assetService,
                                 EngineerService engineerService,
                                 CodeGenerator codeGenerator) {
        this.serviceTicketRepository = serviceTicketRepository;
        this.customerService = customerService;
        this.assetService = assetService;
        this.engineerService = engineerService;
        this.codeGenerator = codeGenerator;
    }

    @Transactional(readOnly = true)
    public List<ServiceTicket> getAll() {
        return serviceTicketRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ServiceTicket getById(Long id) {
        return serviceTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service ticket not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<ServiceTicket> getByCustomer(Long customerId) {
        return serviceTicketRepository.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    public List<ServiceTicket> getByAsset(Long assetId) {
        return serviceTicketRepository.findByAssetIdOrderByCreatedAtDesc(assetId);
    }

    /**
     * Service screen -> "+ New Ticket". Auto-fills the previous-issue note from the
     * asset's most recent prior ticket, mirroring the "Previous issue" callout in the UI.
     */
    public ServiceTicket create(Long customerId, Long assetId, ServiceTicket payload) {
        Customer customer = customerService.getById(customerId);
        Asset asset = assetService.getById(assetId);

        payload.setId(null);
        payload.setCode(null);
        payload.setCustomer(customer);
        payload.setAsset(asset);
        payload.setStatus(ServiceStatus.UNASSIGNED);
        if (payload.getPriority() == null) {
            payload.setPriority(ServicePriority.MEDIUM);
        }

        if (payload.getPreviousIssueNote() == null || payload.getPreviousIssueNote().isBlank()) {
            List<ServiceTicket> priorTickets = serviceTicketRepository.findByAssetIdOrderByCreatedAtDesc(assetId);
            priorTickets.stream().findFirst()
                    .ifPresent(prior -> payload.setPreviousIssueNote(prior.getIssueDescription()));
        }

        ServiceTicket saved = serviceTicketRepository.save(payload);
        saved.setCode(codeGenerator.generate("SR", saved.getId()));
        return serviceTicketRepository.save(saved);
    }

    public ServiceTicket assignEngineer(Long id, Long engineerId) {
        ServiceTicket existing = getById(id);
        Engineer engineer = engineerService.getById(engineerId);
        existing.setAssignedEngineer(engineer);
        existing.setStatus(ServiceStatus.ASSIGNED);
        return serviceTicketRepository.save(existing);
    }

    public ServiceTicket start(Long id) {
        ServiceTicket existing = getById(id);
        if (existing.getStatus() == ServiceStatus.UNASSIGNED) {
            throw new IllegalStateException("Assign an engineer before starting service");
        }
        existing.setStatus(ServiceStatus.IN_PROGRESS);
        return serviceTicketRepository.save(existing);
    }

    public ServiceTicket complete(Long id) {
        ServiceTicket existing = getById(id);
        existing.setStatus(ServiceStatus.COMPLETED);
        return serviceTicketRepository.save(existing);
    }

    public void delete(Long id) {
        serviceTicketRepository.delete(getById(id));
    }
}
