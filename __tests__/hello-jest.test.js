function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 should be 3', () => {
    expect(sum(1,2)).toBe(3);
});