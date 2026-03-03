using AutoMapper;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public class GetDashboardHandler : IRequestHandler<GetDashboardQuery, DashboardDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public GetDashboardHandler(IProductRepository productRepository, ICategoryRepository categoryRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<DashboardDto> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var totalProducts      = await _productRepository.CountAsync(cancellationToken);
        var totalStockValue    = await _productRepository.GetTotalStockValueAsync(cancellationToken);
        var lowStockProducts   = (await _productRepository.GetLowStockAsync(cancellationToken)).ToList();
        var productsByCategory = await _productRepository.GetProductCountByCategoryAsync(cancellationToken);
        var stockByCategory    = await _productRepository.GetStockValueByCategoryAsync(cancellationToken);
        var recentProducts     = (await _productRepository.GetRecentAsync(6, cancellationToken)).ToList();
        var categories         = await _categoryRepository.GetAllAsync(cancellationToken);

        var categoryStats = productsByCategory.Select(kvp => new CategoryStatsDto(
            CategoryName: kvp.Key,
            ProductCount: kvp.Value,
            StockValue: stockByCategory.TryGetValue(kvp.Key, out var val) ? val : 0m
        ));

        return new DashboardDto(
            TotalProducts:      totalProducts,
            TotalStockValue:    totalStockValue,
            LowStockCount:      lowStockProducts.Count,
            CategoryCount:      categories.Count(),
            LowStockProducts:   _mapper.Map<IEnumerable<ProductDto>>(lowStockProducts),
            ProductsByCategory: categoryStats,
            RecentProducts:     _mapper.Map<IEnumerable<ProductDto>>(recentProducts)
        );
    }
}
