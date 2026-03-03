namespace Hypesoft.Application.DTOs;

public record SalesDataPointDto(string Label, decimal Value);

public record SalesDataDto(IEnumerable<SalesDataPointDto> Points);
