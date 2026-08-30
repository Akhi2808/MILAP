package com.akshara.milap.manufacturing.controller;

import com.akshara.milap.manufacturing.entity.Engineer;
import com.akshara.milap.manufacturing.service.EngineerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/engineers")
public class EngineerController {

    private final EngineerService engineerService;

    public EngineerController(EngineerService engineerService) {
        this.engineerService = engineerService;
    }

    @GetMapping
    public List<Engineer> getAll() {
        return engineerService.getAll();
    }

    @GetMapping("/{id}")
    public Engineer getById(@PathVariable Long id) {
        return engineerService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Engineer> create(@Valid @RequestBody Engineer engineer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(engineerService.create(engineer));
    }

    @PutMapping("/{id}")
    public Engineer update(@PathVariable Long id, @Valid @RequestBody Engineer engineer) {
        return engineerService.update(id, engineer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        engineerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
