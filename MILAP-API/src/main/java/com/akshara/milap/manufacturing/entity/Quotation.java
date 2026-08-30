package com.akshara.milap.manufacturing.entity;

import com.akshara.milap.manufacturing.entity.enums.QuotationStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quotations", uniqueConstraints = @UniqueConstraint(name = "uk_quotation_code", columnNames = "code"))
@Getter
@Setter
@NoArgsConstructor
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 30)
    private String code;

    // Attached server-side from the enquiry, not the request body — see Enquiry.customer.
    @ManyToOne
    @JoinColumn(name = "enquiry_id", nullable = false, foreignKey = @ForeignKey(name = "fk_quotation_enquiry"))
    private Enquiry enquiry;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false, foreignKey = @ForeignKey(name = "fk_quotation_customer"))
    private Customer customer;

    @Column(length = 150)
    private String product;

    @Positive
    private Integer quantity;

    @Column(name = "base_price", precision = 14, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "delivery_estimate", length = 50)
    private String deliveryEstimate;

    @Column(name = "payment_terms", length = 50)
    private String paymentTerms;

    @Column(name = "warranty_months")
    private Integer warrantyMonths;

    @Column(name = "total_amount", precision = 14, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuotationStatus status = QuotationStatus.DRAFT;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationLineItem> lineItems = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void addLineItem(QuotationLineItem item) {
        lineItems.add(item);
        item.setQuotation(this);
    }

    public void clearLineItems() {
        lineItems.forEach(i -> i.setQuotation(null));
        lineItems.clear();
    }

    public void recalculateTotal() {
        this.totalAmount = lineItems.stream()
                .map(QuotationLineItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
