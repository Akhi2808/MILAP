package com.akshara.milap.manufacturing.repository;

import com.akshara.milap.manufacturing.entity.Enquiry;
import com.akshara.milap.manufacturing.entity.enums.EnquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByCustomerId(Long customerId);
    List<Enquiry> findByStatus(EnquiryStatus status);
    long countByStatus(EnquiryStatus status);
    long countByCustomerIdAndStatusNot(Long customerId, EnquiryStatus status);
    Optional<Enquiry> findByCode(String code);
}
