package com.akshara.milap.manufacturing.entity;

import com.akshara.milap.manufacturing.entity.enums.OrderStage;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Maps to table "orders" — named SalesOrder in Java to avoid clashing with
 * the SQL reserved word ORDER and with Spring Data's own Sort.Order class.
 */
@Entity
@Table(name = "orders", uniqueConstraints = @UniqueConstraint(name = "uk_order_code", columnNames = "code"))
@Getter
@Setter
@NoArgsConstructor
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 30)
    private String code;

    @NotNull
    @OneToOne
    @JoinColumn(name = "quotation_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_order_quotation"))
    private Quotation quotation;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false, foreignKey = @ForeignKey(name = "fk_order_customer"))
    private Customer customer;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "current_stage", nullable = false, length = 20)
    private OrderStage currentStage = OrderStage.ORDER;

    @Column(name = "engineering_progress_percent")
    private Integer engineeringProgressPercent = 0;

    @Column(name = "procurement_progress_percent")
    private Integer procurementProgressPercent = 0;

    @Lob
    @Column(name = "risk_notes")
    private String riskNotes;

    @Column(name = "planned_completion_date")
    private LocalDate plannedCompletionDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
