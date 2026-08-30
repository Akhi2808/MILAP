package com.akshara.milap.manufacturing.repository;

import com.akshara.milap.manufacturing.entity.Engineer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EngineerRepository extends JpaRepository<Engineer, Long> {
}
