package com.akshara.milap.manufacturing.controller;

import com.akshara.milap.manufacturing.entity.Quotation;
import com.akshara.milap.manufacturing.entity.QuotationLineItem;
import com.akshara.milap.manufacturing.service.QuotationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @GetMapping
    public List<Quotation> getAll() {
        return quotationService.getAll();
    }

    @GetMapping("/{id}")
    public Quotation getById(@PathVariable Long id) {
        return quotationService.getById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Quotation> getByCustomer(@PathVariable Long customerId) {
        return quotationService.getByCustomer(customerId);
    }

    @GetMapping("/enquiry/{enquiryId}")
    public List<Quotation> getByEnquiry(@PathVariable Long enquiryId) {
        return quotationService.getByEnquiry(enquiryId);
    }

    public static class CreateQuotationRequest {
        public Quotation quotation;
        public List<QuotationLineItem> lineItems;
    }

    @PostMapping("/from-enquiry/{enquiryId}")
    public ResponseEntity<Quotation> createFromEnquiry(@PathVariable Long enquiryId, @Valid @RequestBody CreateQuotationRequest request) {
        Quotation created = quotationService.createFromEnquiry(enquiryId, request.quotation, request.lineItems);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public Quotation update(@PathVariable Long id, @Valid @RequestBody Quotation quotation) {
        return quotationService.update(id, quotation);
    }

    @PostMapping("/{id}/line-items")
    public Quotation addLineItem(@PathVariable Long id, @Valid @RequestBody QuotationLineItem item) {
        return quotationService.addLineItem(id, item);
    }

    @DeleteMapping("/{id}/line-items/{lineItemId}")
    public Quotation removeLineItem(@PathVariable Long id, @PathVariable Long lineItemId) {
        return quotationService.removeLineItem(id, lineItemId);
    }

    @PostMapping("/{id}/send")
    public Quotation markSent(@PathVariable Long id) {
        return quotationService.markSent(id);
    }

    @PostMapping("/{id}/approve")
    public Quotation approve(@PathVariable Long id) {
        return quotationService.approve(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        quotationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
