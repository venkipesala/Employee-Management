package com.demo.employee.service;

import com.demo.employee.dto.EmployeeDTO;
import com.demo.employee.entity.Department;
import com.demo.employee.entity.Employee;
import com.demo.employee.repository.DepartmentRepository;
import com.demo.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    @Autowired
    private DepartmentRepository deptRepo;


    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    // CREATE / UPDATE (Unified)
    public Employee save(Employee employee) {
        return repository.save(employee);
    }

    // READ ALL
    public Page<Employee> getAll(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        if (search == null || search.isEmpty()) {
            return repository.findAll(pageable);
        }
        return repository.searchEmployees(search.toLowerCase(), pageable);
    }

    // READ BY ID
    public Employee getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));
    }

    // DELETE
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        repository.deleteById(id);
    }

    public Page<Employee> getEmployees(int page, int size, String search) {
        Pageable pageable =
                PageRequest.of(page, size, Sort.by("id").descending());
        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        } else {
            return repository
                    .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            search, search, pageable);
        }
    }

    public Employee saveWithDept(EmployeeDTO req) {
        Department dept = deptRepo.findById(req.getDeptId())
                .orElseThrow(() -> new RuntimeException("Dept not found"));

        Employee emp = new Employee();
        emp.setName(req.getName());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setDepartment(dept);

        return repository.save(emp);
    }

    public Employee updateWithDept(Long id, EmployeeDTO req) {

        Employee emp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        Department dept = deptRepo.findById(req.getDeptId())
                .orElseThrow(() -> new RuntimeException("Dept not found"));

        emp.setName(req.getName());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setDepartment(dept);

        return repository.save(emp);
    }

    public Page<Employee> search(
            String search,
            Pageable pageable) {

        if (search == null || search.isEmpty()) {
            return repository.findAllWithDepartment(pageable);
        }

        return repository.searchEmployees(search, pageable);
    }


}
