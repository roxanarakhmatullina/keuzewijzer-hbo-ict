export const filterData = async (data, attribute, value) => {
    return data.filter((item) => item[attribute].toLowerCase().includes(value.toLowerCase()));
}