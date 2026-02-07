package com.demo.employee.repository;

import com.demo.employee.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Projects by Department
    @Query("""
    SELECT DISTINCT p FROM Project p
    JOIN p.employees e
    JOIN e.department d
    WHERE d.id = :deptId
    """)
    List<Project> findByDepartmentId(@Param("deptId") Long deptId);

    // Project details with employees
    @Query("""
    SELECT DISTINCT p FROM Project p
    LEFT JOIN FETCH p.employees e
    LEFT JOIN FETCH e.department
    WHERE p.id = :id
    """)
    Project findByIdWithDetails(@Param("id") Long id);

    @Query("""
      SELECT p FROM Project p
      WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :key, '%'))
         OR LOWER(p.status) LIKE LOWER(CONCAT('%', :key, '%'))
    """)
    Page<Project> search(
            @Param("key") String key,
            Pageable pageable
    );
}
