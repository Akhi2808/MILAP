package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.Customer;
import com.akshara.milap.manufacturing.entity.Enquiry;
import com.akshara.milap.manufacturing.entity.enums.EnquiryStatus;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.EnquiryRepository;
import com.akshara.milap.util.CodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final CustomerService customerService;
    private final CodeGenerator codeGenerator;

    public EnquiryService(EnquiryRepository enquiryRepository, CustomerService customerService, CodeGenerator codeGenerator) {
        this.enquiryRepository = enquiryRepository;
        this.customerService = customerService;
        this.codeGenerator = codeGenerator;
    }

    @Transactional(readOnly = true)
    public List<Enquiry> getAll() {
        return enquiryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Enquiry getById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Enquiry> getByCustomer(Long customerId) {
        return enquiryRepository.findByCustomerId(customerId);
    }

    public Enquiry create(Long customerId, Enquiry payload) {
        Customer customer = customerService.getById(customerId);
        payload.setCustomer(customer);
        payload.setId(null);
        payload.setCode(null);
        payload.setStatus(payload.getStatus() == null ? EnquiryStatus.NEW : payload.getStatus());
        Enquiry saved = enquiryRepository.save(payload);
        saved.setCode(codeGenerator.generate("ENQ", saved.getId()));
        return enquiryRepository.save(saved);
    }

    public Enquiry update(Long id, Enquiry payload) {
        Enquiry existing = getById(id);
        existing.setRequirementText(payload.getRequirementText());
        existing.setProduct(payload.getProduct());
        existing.setMaterial(payload.getMaterial());
        existing.setQuantity(payload.getQuantity());
        existing.setKeyParam1(payload.getKeyParam1());
        existing.setKeyParam2(payload.getKeyParam2());
        existing.setRequiredDelivery(payload.getRequiredDelivery());
        existing.setRfqFileName(payload.getRfqFileName());
        existing.setSource(payload.getSource());
        return enquiryRepository.save(existing);
    }

    public Enquiry updateStatus(Long id, EnquiryStatus status) {
        Enquiry existing = getById(id);
        existing.setStatus(status);
        return enquiryRepository.save(existing);
    }

    public void delete(Long id) {
        enquiryRepository.delete(getById(id));
    }
}
