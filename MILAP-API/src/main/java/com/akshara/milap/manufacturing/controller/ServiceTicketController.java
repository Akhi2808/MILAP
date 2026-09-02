package com.akshara.milap.manufacturing.controller;

import com.akshara.milap.manufacturing.entity.ServiceTicket;
import com.akshara.milap.manufacturing.service.ServiceTicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/service-tickets")
public class ServiceTicketController {

    private final ServiceTicketService serviceTicketService;

    public ServiceTicketController(ServiceTicketService serviceTicketService) {
        this.serviceTicketService = serviceTicketService;
    }

    @GetMapping
    public List<ServiceTicket> getAll() {
        return serviceTicketService.getAll();
    }

    @GetMapping("/{id}")
    public ServiceTicket getById(@PathVariable Long id) {
        return serviceTicketService.getById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<ServiceTicket> getByCustomer(@PathVariable Long customerId) {
        return serviceTicketService.getByCustomer(customerId);
    }

    @GetMapping("/asset/{assetId}")
    public List<ServiceTicket> getByAsset(@PathVariable Long assetId) {
        return serviceTicketService.getByAsset(assetId);
    }

    @PostMapping
    public ResponseEntity<ServiceTicket> create(@RequestParam Long customerId,
                                                 @RequestParam Long assetId,
                                                 @Valid @RequestBody ServiceTicket ticket) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceTicketService.create(customerId, assetId, ticket));
    }

    @PatchMapping("/{id}/assign/{engineerId}")
    public ServiceTicket assignEngineer(@PathVariable Long id, @PathVariable Long engineerId) {
        return serviceTicketService.assignEngineer(id, engineerId);
    }

    @PatchMapping("/{id}/start")
    public ServiceTicket start(@PathVariable Long id) {
        return serviceTicketService.start(id);
    }

    @PatchMapping("/{id}/complete")
    public ServiceTicket complete(@PathVariable Long id) {
        return serviceTicketService.complete(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceTicketService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
