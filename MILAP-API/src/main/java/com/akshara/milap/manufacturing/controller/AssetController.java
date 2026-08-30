package com.akshara.milap.manufacturing.controller;

import com.akshara.milap.manufacturing.entity.Asset;
import com.akshara.milap.manufacturing.entity.enums.AssetStatus;
import com.akshara.milap.manufacturing.service.AssetService;
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
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public List<Asset> getAll() {
        return assetService.getAll();
    }

    @GetMapping("/{id}")
    public Asset getById(@PathVariable Long id) {
        return assetService.getById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Asset> getByCustomer(@PathVariable Long customerId) {
        return assetService.getByCustomer(customerId);
    }

    @PostMapping
    public ResponseEntity<Asset> create(@RequestParam Long customerId,
                                         @RequestParam(required = false) Long orderId,
                                         @Valid @RequestBody Asset asset) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assetService.create(customerId, orderId, asset));
    }

    @PutMapping("/{id}")
    public Asset update(@PathVariable Long id, @Valid @RequestBody Asset asset) {
        return assetService.update(id, asset);
    }

    @PatchMapping("/{id}/status")
    public Asset updateStatus(@PathVariable Long id, @RequestParam AssetStatus status) {
        return assetService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
