package com.demo.employee.repository;

import com.demo.employee.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

        Page<Employee> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                String name,
                String email,
                Pageable pageable
        );

        long countByDepartmentId(Long deptId);

        @Query("""
        SELECT e FROM Employee e
        LEFT JOIN FETCH e.department
        LEFT JOIN FETCH e.projects
        """)
        Page<Employee> findAllWithDetails(Pageable p);

        // For detail view (with projects)
        @Query("""
        SELECT DISTINCT e FROM Employee e
        LEFT JOIN FETCH e.department
        LEFT JOIN FETCH e.projects
        WHERE e.id = :id
        """)
        Employee findByIdWithDetails(@Param("id") Long id);

        @Query("""
        SELECT e FROM Employee e
        WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))
        """)
        Page<Employee> searchEmployees(
                @Param("search") String search,
                Pageable pageable
        );

        @Query("""
        SELECT e FROM Employee e
        LEFT JOIN FETCH e.department
        """)
        Page<Employee> findAllWithDepartment(Pageable pageable);

}


