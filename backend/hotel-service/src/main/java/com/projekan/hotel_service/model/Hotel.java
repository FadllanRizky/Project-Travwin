package com.projekan.hotel_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "hotels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    private String province;

    private String area;

    private String propertyType;

    private BigDecimal rating;

    private Integer reviewCount;

    @Column(columnDefinition = "text")
    private String facilities;

    private String palette;

    private String sceneType;

    private Integer popularity;
}