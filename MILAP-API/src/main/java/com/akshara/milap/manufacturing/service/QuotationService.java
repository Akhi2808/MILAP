package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.Enquiry;
import com.akshara.milap.manufacturing.entity.Quotation;
import com.akshara.milap.manufacturing.entity.QuotationLineItem;
import com.akshara.milap.manufacturing.entity.enums.EnquiryStatus;
import com.akshara.milap.manufacturing.entity.enums.QuotationStatus;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.QuotationRepository;
import com.akshara.milap.util.CodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final EnquiryService enquiryService;
    private final CodeGenerator codeGenerator;

    public QuotationService(QuotationRepository quotationRepository, EnquiryService enquiryService, CodeGenerator codeGenerator) {
        this.quotationRepository = quotationRepository;
        this.enquiryService = enquiryService;
        this.codeGenerator = codeGenerator;
    }

    @Transactional(readOnly = true)
    public List<Quotation> getAll() {
        return quotationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Quotation getById(Long id) {
        return quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Quotation> getByCustomer(Long customerId) {
        return quotationRepository.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    public List<Quotation> getByEnquiry(Long enquiryId) {
        return quotationRepository.findByEnquiryId(enquiryId);
    }

    /**
     * Builds a quotation from an enquiry (Enquiries screen -> "Approve & Build Quotation"),
     * attaches the given line items and moves the source enquiry to QUOTED.
     */
    public Quotation createFromEnquiry(Long enquiryId, Quotation payload, List<QuotationLineItem> lineItems) {
        Enquiry enquiry = enquiryService.getById(enquiryId);

        payload.setId(null);
        payload.setCode(null);
        payload.setEnquiry(enquiry);
        payload.setCustomer(enquiry.getCustomer());
        payload.setStatus(QuotationStatus.DRAFT);
        payload.clearLineItems();

        if (lineItems != null) {
            for (QuotationLineItem item : lineItems) {
                payload.addLineItem(new QuotationLineItem(item.getItemName(), item.getQuantity(), item.getAmount()));
            }
        }
        payload.recalculateTotal();

        Quotation saved = quotationRepository.save(payload);
        saved.setCode(codeGenerator.generate("Q", saved.getId()));
        saved = quotationRepository.save(saved);

        enquiryService.updateStatus(enquiryId, EnquiryStatus.QUOTED);
        return saved;
    }

    public Quotation update(Long id, Quotation payload) {
        Quotation existing = getById(id);
        existing.setProduct(payload.getProduct());
        existing.setQuantity(payload.getQuantity());
        existing.setBasePrice(payload.getBasePrice());
        existing.setDeliveryEstimate(payload.getDeliveryEstimate());
        existing.setPaymentTerms(payload.getPaymentTerms());
        existing.setWarrantyMonths(payload.getWarrantyMonths());
        return quotationRepository.save(existing);
    }

    public Quotation addLineItem(Long id, QuotationLineItem item) {
        Quotation existing = getById(id);
        existing.addLineItem(new QuotationLineItem(item.getItemName(), item.getQuantity(), item.getAmount()));
        existing.recalculateTotal();
        return quotationRepository.save(existing);
    }

    public Quotation removeLineItem(Long id, Long lineItemId) {
        Quotation existing = getById(id);
        boolean removed = existing.getLineItems().removeIf(li -> li.getId().equals(lineItemId));
        if (!removed) {
            throw new ResourceNotFoundException("Line item not found: " + lineItemId);
        }
        existing.recalculateTotal();
        return quotationRepository.save(existing);
    }

    public Quotation approve(Long id) {
        Quotation existing = getById(id);
        if (existing.getStatus() == QuotationStatus.CONVERTED) {
            throw new IllegalStateException("Quotation is already converted to an order");
        }
        existing.setStatus(QuotationStatus.APPROVED);
        return quotationRepository.save(existing);
    }

    public Quotation markSent(Long id) {
        Quotation existing = getById(id);
        existing.setStatus(QuotationStatus.SENT);
        return quotationRepository.save(existing);
    }

    void markConverted(Long id) {
        Quotation existing = getById(id);
        existing.setStatus(QuotationStatus.CONVERTED);
        quotationRepository.save(existing);
    }

    public void delete(Long id) {
        quotationRepository.delete(getById(id));
    }
}
