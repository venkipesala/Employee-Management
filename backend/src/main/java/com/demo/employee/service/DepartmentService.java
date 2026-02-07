package com.demo.employee.service;

import com.demo.employee.entity.Department;
import com.demo.employee.entity.Employee;
import com.demo.employee.repository.DepartmentRepository;
import com.demo.employee.repository.EmployeeRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository deptRepo;
    private final EmployeeRepository empRepo;

    public DepartmentService(DepartmentRepository deptRepo,
                             EmployeeRepository empRepo) {
        this.deptRepo = deptRepo;
        this.empRepo = empRepo;
    }

    // CREATE / UPDATE
    public Department save(Department dept) {
        return deptRepo.save(dept);
    }

    // READ ALL
    public List<Department> getAll() {
        return deptRepo.findAll();
    }

    // READ BY ID
    public Department getById(Long id) {

        return deptRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));
    }

    // DELETE
    public void delete(Long deptId) {

        if (!deptRepo.existsById(deptId)) {
            throw new RuntimeException("Department not found");
        }
        long empCount = empRepo.countByDepartmentId(deptId);

        if (empCount > 0) {
            throw new RuntimeException(
                    "Cannot delete department. Employees are assigned."
            );
        }
        deptRepo.deleteById(deptId);
    }

    public Page<Department> getDepartments(
            int page,
            int size,
            String search) {

        Pageable pageable =
                PageRequest.of(page, size, Sort.by("id").ascending());

        if (search == null || search.isBlank()) {
            return deptRepo.findAll(pageable);
        } else {
            return deptRepo
                    .findByNameContainingIgnoreCase(
                            search, pageable);
        }
    }

    @Transactional
    public void assignEmployees(Long deptId,
                                List<Long> empIds) {
        Department dept =
                deptRepo.findById(deptId)
                        .orElseThrow();

        List<Employee> emps =
                empRepo.findAllById(empIds);

        for (Employee e : emps) {
            e.setDepartment(dept);
        }
        empRepo.saveAll(emps);
    }


}

