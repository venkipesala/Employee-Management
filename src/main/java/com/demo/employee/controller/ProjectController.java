package com.demo.employee.controller;

import com.demo.employee.dto.ProjectDTO;
import com.demo.employee.entity.Employee;
import com.demo.employee.entity.Project;
import com.demo.employee.repository.EmployeeRepository;
import com.demo.employee.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectService service;
    private final EmployeeRepository empRepo;

    public ProjectController(ProjectService service,
                             EmployeeRepository empRepo) {
        this.service = service;
        this.empRepo = empRepo;
    }

    @PostMapping
    public Project create(@RequestBody ProjectDTO req) {
        return service.saveWithEmployees(req);
    }

    @GetMapping
    public List<Project> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id,
                          @RequestBody ProjectDTO req) {
        return service.updateWithEmployees(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
