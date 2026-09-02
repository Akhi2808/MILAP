package com.akshara.milap.manufacturing.repository;

import com.akshara.milap.manufacturing.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByCustomerId(Long customerId);
    Optional<Asset> findBySerialNumber(String serialNumber);
    long countByCustomerId(Long customerId);
    List<Asset> findByWarrantyExpiryBetween(LocalDate start, LocalDate end);
}
