package com.akshara.milap.manufacturing.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "quotation_line_items")
@Getter
@Setter
@NoArgsConstructor
public class QuotationLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Attached server-side, not from the request body — see Enquiry.customer.
    @ManyToOne
    @JoinColumn(name = "quotation_id", nullable = false, foreignKey = @ForeignKey(name = "fk_line_item_quotation"))
    @JsonIgnore
    private Quotation quotation;

    @NotBlank
    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    public QuotationLineItem(String itemName, Integer quantity, BigDecimal amount) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.amount = amount;
    }
}
