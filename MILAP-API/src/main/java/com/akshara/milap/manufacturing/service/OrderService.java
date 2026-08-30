package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.Quotation;
import com.akshara.milap.manufacturing.entity.SalesOrder;
import com.akshara.milap.manufacturing.entity.enums.OrderStage;
import com.akshara.milap.manufacturing.entity.enums.QuotationStatus;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.SalesOrderRepository;
import com.akshara.milap.util.CodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final QuotationService quotationService;
    private final CodeGenerator codeGenerator;

    public OrderService(SalesOrderRepository salesOrderRepository, QuotationService quotationService, CodeGenerator codeGenerator) {
        this.salesOrderRepository = salesOrderRepository;
        this.quotationService = quotationService;
        this.codeGenerator = codeGenerator;
    }

    @Transactional(readOnly = true)
    public List<SalesOrder> getAll() {
        return salesOrderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public SalesOrder getById(Long id) {
        return salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<SalesOrder> getByCustomer(Long customerId) {
        return salesOrderRepository.findByCustomerId(customerId);
    }

    /**
     * Quotation screen -> "Approve & Convert to Order". A quotation may only be
     * converted once (quotation_id is unique on orders), and must be APPROVED first.
     */
    public SalesOrder convertFromQuotation(Long quotationId) {
        Quotation quotation = quotationService.getById(quotationId);

        if (quotation.getStatus() == QuotationStatus.CONVERTED) {
            throw new IllegalStateException("Quotation " + quotation.getCode() + " has already been converted to an order");
        }
        if (quotation.getStatus() != QuotationStatus.APPROVED) {
            throw new IllegalStateException("Quotation must be APPROVED before it can be converted to an order");
        }
        salesOrderRepository.findByQuotationId(quotationId).ifPresent(existing -> {
            throw new IllegalStateException("An order already exists for this quotation: " + existing.getCode());
        });

        SalesOrder order = new SalesOrder();
        order.setQuotation(quotation);
        order.setCustomer(quotation.getCustomer());
        order.setCurrentStage(OrderStage.ORDER);

        SalesOrder saved = salesOrderRepository.save(order);
        saved.setCode(codeGenerator.generate("ORD", saved.getId()));
        saved = salesOrderRepository.save(saved);

        quotationService.markConverted(quotationId);
        return saved;
    }

    public SalesOrder advanceStage(Long id, OrderStage stage) {
        SalesOrder existing = getById(id);
        existing.setCurrentStage(stage);
        return salesOrderRepository.save(existing);
    }

    public SalesOrder updateProgress(Long id, Integer engineeringProgressPercent, Integer procurementProgressPercent, String riskNotes) {
        SalesOrder existing = getById(id);
        if (engineeringProgressPercent != null) existing.setEngineeringProgressPercent(engineeringProgressPercent);
        if (procurementProgressPercent != null) existing.setProcurementProgressPercent(procurementProgressPercent);
        if (riskNotes != null) existing.setRiskNotes(riskNotes);
        return salesOrderRepository.save(existing);
    }

    public void delete(Long id) {
        salesOrderRepository.delete(getById(id));
    }
}
