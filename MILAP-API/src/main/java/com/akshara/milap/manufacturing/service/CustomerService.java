package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.Customer;
import com.akshara.milap.manufacturing.entity.enums.EnquiryStatus;
import com.akshara.milap.manufacturing.entity.enums.OrderStage;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.AssetRepository;
import com.akshara.milap.manufacturing.repository.CustomerRepository;
import com.akshara.milap.manufacturing.repository.EnquiryRepository;
import com.akshara.milap.manufacturing.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final EnquiryRepository enquiryRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final AssetRepository assetRepository;

    public CustomerService(CustomerRepository customerRepository,
                            EnquiryRepository enquiryRepository,
                            SalesOrderRepository salesOrderRepository,
                            AssetRepository assetRepository) {
        this.customerRepository = customerRepository;
        this.enquiryRepository = enquiryRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.assetRepository = assetRepository;
    }

    @Transactional(readOnly = true)
    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }

    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer update(Long id, Customer payload) {
        Customer existing = getById(id);
        existing.setName(payload.getName());
        existing.setIndustry(payload.getIndustry());
        existing.setContactPerson(payload.getContactPerson());
        existing.setEmail(payload.getEmail());
        existing.setPhone(payload.getPhone());
        existing.setAddress(payload.getAddress());
        return customerRepository.save(existing);
    }

    public void delete(Long id) {
        Customer existing = getById(id);
        customerRepository.delete(existing);
    }

    /**
     * Powers the Customers screen columns: open enquiries, active orders, installed assets.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getSummary(Long id) {
        Customer customer = getById(id);
        long openEnquiries = enquiryRepository.countByCustomerIdAndStatusNot(id, EnquiryStatus.CLOSED);
        long activeOrders = salesOrderRepository.countByCustomerIdAndCurrentStageNot(id, OrderStage.INSTALLATION);
        long installedAssets = assetRepository.countByCustomerId(id);
        return Map.of(
                "customerId", customer.getId(),
                "customerName", customer.getName(),
                "openEnquiries", openEnquiries,
                "activeOrders", activeOrders,
                "installedAssets", installedAssets
        );
    }
}
