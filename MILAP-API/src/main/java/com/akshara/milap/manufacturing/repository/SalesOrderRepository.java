package com.akshara.milap.manufacturing.repository;

import com.akshara.milap.manufacturing.entity.SalesOrder;
import com.akshara.milap.manufacturing.entity.enums.OrderStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByCustomerId(Long customerId);
    Optional<SalesOrder> findByQuotationId(Long quotationId);
    Optional<SalesOrder> findByCode(String code);
    long countByCurrentStageNot(OrderStage stage);
    long countByCustomerIdAndCurrentStageNot(Long customerId, OrderStage stage);
    List<SalesOrder> findByCurrentStageNotAndRiskNotesIsNotNull(OrderStage stage);
}
