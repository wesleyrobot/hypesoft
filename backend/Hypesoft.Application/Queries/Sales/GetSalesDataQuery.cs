using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries.Sales;

public record GetSalesDataQuery(string Period, string? Category) : IRequest<SalesDataDto>;
