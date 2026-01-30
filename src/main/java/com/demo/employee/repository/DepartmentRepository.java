package com.demo.employee.repository;

import com.demo.employee.entity.Department;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    Page<Department> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );
}

