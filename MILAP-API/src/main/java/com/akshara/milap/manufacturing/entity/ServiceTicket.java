package com.akshara.milap.manufacturing.entity;

import com.akshara.milap.manufacturing.entity.enums.ServicePriority;
import com.akshara.milap.manufacturing.entity.enums.ServiceStatus;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_tickets", uniqueConstraints = @UniqueConstraint(name = "uk_service_ticket_code", columnNames = "code"))
@Getter
@Setter
@NoArgsConstructor
public class ServiceTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 30)
    private String code;

    // Attached server-side, not from the request body — see Enquiry.customer.
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ticket_customer"))
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ticket_asset"))
    private Asset asset;

    @ManyToOne
    @JoinColumn(name = "assigned_engineer_id", foreignKey = @ForeignKey(name = "fk_ticket_engineer"))
    private Engineer assignedEngineer;

    @NotBlank
    @Lob
    @Column(name = "issue_description", nullable = false)
    private String issueDescription;

    @Column(name = "previous_issue_note", length = 255)
    private String previousIssueNote;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ServicePriority priority = ServicePriority.MEDIUM;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ServiceStatus status = ServiceStatus.UNASSIGNED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
