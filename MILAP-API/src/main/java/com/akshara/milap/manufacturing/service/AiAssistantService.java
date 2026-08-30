package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.KnowledgeDocument;
import com.akshara.milap.manufacturing.entity.Quotation;
import com.akshara.milap.manufacturing.entity.SalesOrder;
import com.akshara.milap.manufacturing.entity.enums.ServicePriority;
import com.akshara.milap.manufacturing.entity.enums.ServiceStatus;
import com.akshara.milap.manufacturing.entity.enums.OrderStage;
import com.akshara.milap.manufacturing.entity.enums.QuotationStatus;
import com.akshara.milap.manufacturing.repository.KnowledgeDocumentRepository;
import com.akshara.milap.manufacturing.repository.QuotationRepository;
import com.akshara.milap.manufacturing.repository.SalesOrderRepository;
import com.akshara.milap.manufacturing.repository.ServiceTicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Backs the Ask AI screen's chat box with real, keyword-routed answers drawn
 * from live data instead of canned text.
 */
@Service
@Transactional(readOnly = true)
public class AiAssistantService {

    private final QuotationRepository quotationRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final ServiceTicketRepository serviceTicketRepository;
    private final KnowledgeDocumentRepository documentRepository;

    public AiAssistantService(QuotationRepository quotationRepository,
                               SalesOrderRepository salesOrderRepository,
                               ServiceTicketRepository serviceTicketRepository,
                               KnowledgeDocumentRepository documentRepository) {
        this.quotationRepository = quotationRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.serviceTicketRepository = serviceTicketRepository;
        this.documentRepository = documentRepository;
    }

    public String ask(String question) {
        String q = question == null ? "" : question.toLowerCase();

        if (q.contains("quotation")) {
            return answerStaleQuotations();
        }
        if (q.contains("risk") || q.contains("delay")) {
            return answerOrdersAtRisk();
        }
        if (q.contains("service")) {
            return answerOpenServiceTickets();
        }
        if (q.contains("document") || q.contains("catalogue") || q.contains("catalog") || q.contains("manual") || q.contains("sop")) {
            return answerDocuments();
        }
        return "I can answer questions about quotations, order risk/delay, open service tickets, or your connected knowledge documents. Try one of those topics.";
    }

    private String answerStaleQuotations() {
        List<Quotation> stale = quotationRepository.findByStatusInAndCreatedAtBefore(
                List.of(QuotationStatus.DRAFT, QuotationStatus.SENT), LocalDateTime.now().minusDays(7));
        if (stale.isEmpty()) {
            return "No quotations have been sitting without follow-up for 7+ days.";
        }
        BigDecimal total = stale.stream()
                .map(qq -> qq.getTotalAmount() == null ? BigDecimal.ZERO : qq.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Quotation highest = stale.stream()
                .max((a, b) -> nz(a.getTotalAmount()).compareTo(nz(b.getTotalAmount())))
                .orElse(null);
        String highestNote = highest != null ? (" " + highest.getCode() + " is the highest-value stale opportunity at " + nz(highest.getTotalAmount()) + ".") : "";
        return stale.size() + " quotations have had no follow-up for 7+ days, combined value " + total + "." + highestNote;
    }

    private String answerOrdersAtRisk() {
        List<SalesOrder> atRisk = salesOrderRepository.findByCurrentStageNotAndRiskNotesIsNotNull(OrderStage.INSTALLATION);
        if (atRisk.isEmpty()) {
            return "No active orders currently have recorded risk notes.";
        }
        String summary = atRisk.stream()
                .limit(3)
                .map(o -> o.getCode() + ": " + o.getRiskNotes())
                .collect(Collectors.joining(" | "));
        return atRisk.size() + " order(s) at risk. " + summary;
    }

    private String answerOpenServiceTickets() {
        long open = serviceTicketRepository.countByStatusNot(ServiceStatus.COMPLETED);
        long highPriority = serviceTicketRepository.countByStatusNotAndPriority(ServiceStatus.COMPLETED, ServicePriority.HIGH);
        return "There are " + open + " open service tickets, " + highPriority + " high priority.";
    }

    private String answerDocuments() {
        List<KnowledgeDocument> docs = documentRepository.findAll();
        if (docs.isEmpty()) {
            return "No documents are connected yet. Upload one from the Knowledge panel to start asking questions about it.";
        }
        String names = docs.stream().map(KnowledgeDocument::getName).collect(Collectors.joining(", "));
        return "MILAP has " + docs.size() + " document(s) connected: " + names + ".";
    }

    private BigDecimal nz(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
