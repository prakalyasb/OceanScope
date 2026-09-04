import copernicusmarine

copernicusmarine.subset(
    dataset_id="cmems_mod_glo_phy_my_0.083deg_P1D-m",
    variables=["uo", "vo"],

    minimum_longitude=70,
    maximum_longitude=71,

    minimum_latitude=10,
    maximum_latitude=11,

    start_datetime="2020-01-01",
    end_datetime="2020-01-01",

    minimum_depth=0,
    maximum_depth=1,

    output_filename="copernicus_sample.nc",
    output_directory="copernicus-data",

    netcdf3_compatible=True
)