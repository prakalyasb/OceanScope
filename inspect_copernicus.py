import xarray as xr

ds = xr.open_dataset("copernicus-data/copernicus_sample.nc")

print("\n===== STRUCTURE =====")
print(ds)

print("\n===== VARIABLES =====")
print(list(ds.data_vars))

print("\n===== DIMENSIONS =====")
print(ds.dims)

print("\n===== UNITS =====")
for name in ds.variables:
    print(name, "->", ds[name].attrs.get("units"))
    