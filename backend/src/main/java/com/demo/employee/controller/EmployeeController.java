package com.demo.employee.controller;

import com.demo.employee.dto.EmployeeDTO;
import com.demo.employee.entity.Department;
import com.demo.employee.entity.Employee;
import com.demo.employee.repository.DepartmentRepository;
import com.demo.employee.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService service;
    private final DepartmentRepository deptRepo;

    public EmployeeController(EmployeeService service,
                              DepartmentRepository deptRepo) {
        this.service = service;
        this.deptRepo = deptRepo;
    }

    @PostMapping
    public Employee create(@RequestBody EmployeeDTO req) {
        return service.saveWithDept(req);
    }

    // GET BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get Employee by ID")
    public Employee getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Employee update(
            @PathVariable Long id,
            @RequestBody EmployeeDTO req
    ) {
        return service.updateWithDept(id, req);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Employee")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping
    public Page<Employee> getAll(
            @RequestParam(defaultValue="") String search,
            Pageable pageable) {

        return service.search(search, pageable);
    }

    @GetMapping("/health")
    public String health() {
        return "OK - CI/CD Working";
    }

}
