package com.demo.employee.controller;

import com.demo.employee.entity.Department;
import com.demo.employee.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Create Department")
    public Department create(@RequestBody Department dept) {
        return service.save(dept);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Department by ID")
    public Department getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Department")
    public Department update(@PathVariable Long id,
                             @RequestBody Department dept) {

        Department existing = service.getById(id);

        existing.setName(dept.getName());
        existing.setLocation(dept.getLocation());

        return service.save(existing);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Department")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping
    public Page<Department> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        return service.getDepartments(page, size, search);
    }

    @PutMapping("/{id}/employees")
    public void assignEmployees(
            @PathVariable Long id,
            @RequestBody List<Long> empIds) {

        service.assignEmployees(id, empIds);
    }

}
