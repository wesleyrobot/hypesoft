using Hypesoft.Application.Queries.Sales;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SalesController : ControllerBase
{
    private readonly IMediator _mediator;
    public SalesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetSalesData(
        [FromQuery] string period = "weekly",
        [FromQuery] string? category = null,
        CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetSalesDataQuery(period, category), cancellationToken));
}
