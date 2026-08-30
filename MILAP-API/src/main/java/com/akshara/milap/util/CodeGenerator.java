package com.akshara.milap.util;

import org.springframework.stereotype.Component;

@Component
public class CodeGenerator {

    public String generate(String prefix, Long id) {
        return prefix + "-" + String.format("%06d", id);
    }
}
