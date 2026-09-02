package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.Engineer;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.EngineerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EngineerService {

    private final EngineerRepository engineerRepository;

    public EngineerService(EngineerRepository engineerRepository) {
        this.engineerRepository = engineerRepository;
    }

    @Transactional(readOnly = true)
    public List<Engineer> getAll() {
        return engineerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Engineer getById(Long id) {
        return engineerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Engineer not found: " + id));
    }

    public Engineer create(Engineer engineer) {
        return engineerRepository.save(engineer);
    }

    public Engineer update(Long id, Engineer payload) {
        Engineer existing = getById(id);
        existing.setName(payload.getName());
        existing.setRole(payload.getRole());
        existing.setEmail(payload.getEmail());
        existing.setPhone(payload.getPhone());
        return engineerRepository.save(existing);
    }

    public void delete(Long id) {
        engineerRepository.delete(getById(id));
    }
}
