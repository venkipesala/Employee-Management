package com.demo.employee.service;

import com.demo.employee.dto.ProjectDTO;
import com.demo.employee.entity.Employee;
import com.demo.employee.entity.Project;
import com.demo.employee.entity.ProjectStatus;
import com.demo.employee.repository.EmployeeRepository;
import com.demo.employee.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final EmployeeRepository empRepo;

    public ProjectService(ProjectRepository projectRepo,
                          EmployeeRepository empRepo) {
        this.projectRepo = projectRepo;
        this.empRepo = empRepo;
    }

    public Project saveWithEmployees(ProjectDTO req) {
        List<Employee> emps =
                empRepo.findAllById(req.getEmployeeIds());

        Project p = new Project();
        p.setName(req.getName());
        p.setStatus(ProjectStatus.valueOf(req.getStatus()));
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        p.setEmployees(emps);
        return projectRepo.save(p);
    }

    public List<Project> getAll() {
        return projectRepo.findAll();
    }

    public Project getById(Long id) {
        return projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public void delete(Long id) {
        projectRepo.deleteById(id);
    }

    public Project updateWithEmployees(Long id,
                                       ProjectDTO req) {
        Project p = projectRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        List<Employee> emps =
                empRepo.findAllById(req.getEmployeeIds());

        p.setName(req.getName());
        p.setStatus(ProjectStatus.valueOf(req.getStatus()));
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        p.setEmployees(emps);
        return projectRepo.save(p);
    }

}