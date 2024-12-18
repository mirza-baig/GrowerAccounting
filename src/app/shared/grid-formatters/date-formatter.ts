export const dateFormatter = (params: any) => {
  if (!!!params.value) {
    return 'N/A';
  }
  return new Date(params.value).toLocaleDateString();
};
