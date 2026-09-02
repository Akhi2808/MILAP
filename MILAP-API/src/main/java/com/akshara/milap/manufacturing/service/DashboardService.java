package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.enums.EnquiryStatus;
import com.akshara.milap.manufacturing.entity.enums.OrderStage;
import com.akshara.milap.manufacturing.entity.enums.QuotationStatus;
import com.akshara.milap.manufacturing.entity.enums.ServicePriority;
import com.akshara.milap.manufacturing.entity.enums.ServiceStatus;
import com.akshara.milap.manufacturing.repository.EnquiryRepository;
import com.akshara.milap.manufacturing.repository.QuotationRepository;
import com.akshara.milap.manufacturing.repository.SalesOrderRepository;
import com.akshara.milap.manufacturing.repository.ServiceTicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Backs the Executive Dashboard screen's KPI tiles.
 */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final EnquiryRepository enquiryRepository;
    private final QuotationRepository quotationRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final ServiceTicketRepository serviceTicketRepository;

    public DashboardService(EnquiryRepository enquiryRepository,
                             QuotationRepository quotationRepository,
                             SalesOrderRepository salesOrderRepository,
                             ServiceTicketRepository serviceTicketRepository) {
        this.enquiryRepository = enquiryRepository;
        this.quotationRepository = quotationRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.serviceTicketRepository = serviceTicketRepository;
    }

    public Map<String, Object> getSummary() {
        long newEnquiries = enquiryRepository.countByStatus(EnquiryStatus.NEW);
        long pendingQuotations = quotationRepository.countByStatusIn(List.of(QuotationStatus.DRAFT, QuotationStatus.SENT));
        long activeOrders = salesOrderRepository.countByCurrentStageNot(OrderStage.INSTALLATION);
        long openServiceTickets = serviceTicketRepository.countByStatusNot(ServiceStatus.COMPLETED);
        long highPriorityOpenTickets = serviceTicketRepository.countByStatusNotAndPriority(ServiceStatus.COMPLETED, ServicePriority.HIGH);

        return Map.of(
                "newEnquiries", newEnquiries,
                "pendingQuotations", pendingQuotations,
                "activeOrders", activeOrders,
                "openServiceTickets", openServiceTickets,
                "highPriorityOpenTickets", highPriorityOpenTickets
        );
    }
}
