const canUpdateRank = (i) => {
    const index = i;

    return !(
        index === 6 && true ||
        index === 0 && true ||
        false
    )
}

console.log(canUpdateRank(4));