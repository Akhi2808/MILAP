package com.akshara.milap.manufacturing.controller;

import com.akshara.milap.manufacturing.entity.SalesOrder;
import com.akshara.milap.manufacturing.entity.enums.OrderStage;
import com.akshara.milap.manufacturing.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<SalesOrder> getAll() {
        return orderService.getAll();
    }

    @GetMapping("/{id}")
    public SalesOrder getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<SalesOrder> getByCustomer(@PathVariable Long customerId) {
        return orderService.getByCustomer(customerId);
    }

    @PostMapping("/from-quotation/{quotationId}")
    public ResponseEntity<SalesOrder> convertFromQuotation(@PathVariable Long quotationId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.convertFromQuotation(quotationId));
    }

    @PatchMapping("/{id}/stage")
    public SalesOrder advanceStage(@PathVariable Long id, @RequestParam OrderStage stage) {
        return orderService.advanceStage(id, stage);
    }

    @PatchMapping("/{id}/progress")
    public SalesOrder updateProgress(@PathVariable Long id,
                                      @RequestParam(required = false) Integer engineeringProgressPercent,
                                      @RequestParam(required = false) Integer procurementProgressPercent,
                                      @RequestParam(required = false) String riskNotes) {
        return orderService.updateProgress(id, engineeringProgressPercent, procurementProgressPercent, riskNotes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
