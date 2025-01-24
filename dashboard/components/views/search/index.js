'use client'
import React, {useEffect} from 'react';
import Input from "@/components/input";
import Button from "@/components/button";
import Add from "@mui/icons-material/Add";

const SearchView = ({handleNew, onChange}) => {
    return (
        <div
            className={"w-full flex flex-col-reverse md:flex-row justify-end align-middle md:items-center items-end gap-[10px] box-border"}>
            <Input
                type={"search"}
                placeholder={"Zoeken..."}
                onChange={onChange}
            />
            <Button
                type={"primary"}
                onClick={handleNew}
            >
                <Add/> Nieuw
            </Button>
        </div>
    )
}

export default SearchView;