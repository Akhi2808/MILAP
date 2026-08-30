package com.akshara.milap.manufacturing.service;

import com.akshara.milap.manufacturing.entity.KnowledgeDocument;
import com.akshara.milap.exception.ResourceNotFoundException;
import com.akshara.milap.manufacturing.repository.KnowledgeDocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class KnowledgeDocumentService {

    private final KnowledgeDocumentRepository documentRepository;

    public KnowledgeDocumentService(KnowledgeDocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @Transactional(readOnly = true)
    public List<KnowledgeDocument> getAll() {
        return documentRepository.findAll();
    }

    public KnowledgeDocument upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A non-empty file is required");
        }
        KnowledgeDocument doc = new KnowledgeDocument();
        doc.setName(file.getOriginalFilename());
        doc.setSizeBytes(file.getSize());
        doc.setContentType(file.getContentType());
        return documentRepository.save(doc);
    }

    public void delete(Long id) {
        KnowledgeDocument existing = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));
        documentRepository.delete(existing);
    }
}
