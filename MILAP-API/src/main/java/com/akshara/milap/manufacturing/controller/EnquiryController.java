package com.akshara.milap.manufacturing.controller;

import com.akshara.milap.manufacturing.entity.Enquiry;
import com.akshara.milap.manufacturing.entity.enums.EnquiryStatus;
import com.akshara.milap.manufacturing.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @GetMapping
    public List<Enquiry> getAll() {
        return enquiryService.getAll();
    }

    @GetMapping("/{id}")
    public Enquiry getById(@PathVariable Long id) {
        return enquiryService.getById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Enquiry> getByCustomer(@PathVariable Long customerId) {
        return enquiryService.getByCustomer(customerId);
    }

    @PostMapping
    public ResponseEntity<Enquiry> create(@RequestParam Long customerId, @Valid @RequestBody Enquiry enquiry) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enquiryService.create(customerId, enquiry));
    }

    @PutMapping("/{id}")
    public Enquiry update(@PathVariable Long id, @Valid @RequestBody Enquiry enquiry) {
        return enquiryService.update(id, enquiry);
    }

    @PatchMapping("/{id}/status")
    public Enquiry updateStatus(@PathVariable Long id, @RequestParam EnquiryStatus status) {
        return enquiryService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enquiryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
