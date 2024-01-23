def test(x: list[int]):
    return [n * n for n in x]


test  # pyright: ignore[reportUnusedExpression] # noqa: B018
