package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.Asset;
import com.akshara.milap.manufacturing.entity.Customer;
import com.akshara.milap.manufacturing.entity.SalesOrder;
import com.akshara.milap.manufacturing.entity.enums.AssetStatus;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AssetService {

    private final AssetRepository assetRepository;
    private final CustomerService customerService;
    private final OrderService orderService;

    public AssetService(AssetRepository assetRepository, CustomerService customerService, OrderService orderService) {
        this.assetRepository = assetRepository;
        this.customerService = customerService;
        this.orderService = orderService;
    }

    @Transactional(readOnly = true)
    public List<Asset> getAll() {
        return assetRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Asset getById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Asset> getByCustomer(Long customerId) {
        return assetRepository.findByCustomerId(customerId);
    }

    public Asset create(Long customerId, Long orderId, Asset payload) {
        Customer customer = customerService.getById(customerId);
        payload.setId(null);
        payload.setCustomer(customer);
        if (orderId != null) {
            SalesOrder order = orderService.getById(orderId);
            payload.setOrder(order);
        }
        if (payload.getStatus() == null) {
            payload.setStatus(AssetStatus.OPERATIONAL);
        }
        return assetRepository.save(payload);
    }

    public Asset update(Long id, Asset payload) {
        Asset existing = getById(id);
        existing.setName(payload.getName());
        existing.setSerialNumber(payload.getSerialNumber());
        existing.setInstalledDate(payload.getInstalledDate());
        existing.setWarrantyExpiry(payload.getWarrantyExpiry());
        existing.setNextServiceDate(payload.getNextServiceDate());
        return assetRepository.save(existing);
    }

    public Asset updateStatus(Long id, AssetStatus status) {
        Asset existing = getById(id);
        existing.setStatus(status);
        return assetRepository.save(existing);
    }

    public void delete(Long id) {
        assetRepository.delete(getById(id));
    }
}
