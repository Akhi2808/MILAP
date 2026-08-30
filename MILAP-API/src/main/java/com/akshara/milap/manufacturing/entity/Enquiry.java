package com.akshara.milap.manufacturing.entity;

import com.akshara.milap.manufacturing.entity.enums.EnquirySource;
import com.akshara.milap.manufacturing.entity.enums.EnquiryStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "enquiries", uniqueConstraints = @UniqueConstraint(name = "uk_enquiry_code", columnNames = "code"))
@Getter
@Setter
@NoArgsConstructor
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 30)
    private String code;

    // Not @NotNull: this is attached server-side by the service from a path/query
    // param, not from the request body, so it is legitimately absent at bind time.
    // The DB column is still declared nullable = false.
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false, foreignKey = @jakarta.persistence.ForeignKey(name = "fk_enquiry_customer"))
    private Customer customer;

    @NotBlank
    @Lob
    @Column(name = "requirement_text", nullable = false)
    private String requirementText;

    @Column(length = 150)
    private String product;

    @Column(length = 100)
    private String material;

    @Positive
    private Integer quantity;

    @Column(name = "key_param_1", length = 150)
    private String keyParam1;

    @Column(name = "key_param_2", length = 150)
    private String keyParam2;

    @Column(name = "required_delivery", length = 50)
    private String requiredDelivery;

    @Column(name = "rfq_file_name", length = 255)
    private String rfqFileName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnquirySource source;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnquiryStatus status = EnquiryStatus.NEW;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
