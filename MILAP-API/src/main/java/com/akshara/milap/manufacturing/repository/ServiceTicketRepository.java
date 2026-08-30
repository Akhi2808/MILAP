package com.akshara.milap.manufacturing.repository;

import com.akshara.milap.manufacturing.entity.ServiceTicket;
import com.akshara.milap.manufacturing.entity.enums.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceTicketRepository extends JpaRepository<ServiceTicket, Long> {
    List<ServiceTicket> findByCustomerId(Long customerId);
    List<ServiceTicket> findByAssetIdOrderByCreatedAtDesc(Long assetId);
    List<ServiceTicket> findByStatus(ServiceStatus status);
    long countByStatusNot(ServiceStatus status);
    long countByStatusNotAndPriority(ServiceStatus status, com.akshara.milap.manufacturing.entity.enums.ServicePriority priority);
    Optional<ServiceTicket> findByCode(String code);
}
