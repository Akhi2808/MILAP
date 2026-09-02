package com.akshara.milap.manufacturing.repository;

import com.akshara.milap.manufacturing.entity.Quotation;
import com.akshara.milap.manufacturing.entity.enums.QuotationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    List<Quotation> findByCustomerId(Long customerId);
    List<Quotation> findByEnquiryId(Long enquiryId);
    List<Quotation> findByStatus(QuotationStatus status);
    long countByStatusIn(List<QuotationStatus> statuses);
    List<Quotation> findByStatusInAndCreatedAtBefore(List<QuotationStatus> statuses, LocalDateTime before);
    Optional<Quotation> findByCode(String code);
}
