import React, {useContext, useEffect, useState} from "react";
import {useGetFeedPostQuery} from "../services/posts";
import ReactPaginate from "react-paginate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {SearchContext} from "./searchContext";

const Home = () => {
    const {searchValue} = useContext(SearchContext);
    const [page, setPage] = useState(1);
    const {data, isLoading, error} = useGetFeedPostQuery({page, perPage: 6, search: searchValue ?? ''});
    const [posts, setPosts] = useState({data: [], total: 0});

    useEffect(() => {
        setPosts(data?.data);
    }, [data])

    if (isLoading) {
        return <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">Loading...</div>;
    }
    if (!data) {
        return <div>No posts added yet!</div>;
    }
    if (error) return <div>An error has occurred!</div>;

    const handlePageChange = (event) => {
        setPage(event.selected + 1);
    };

    return (
        <div className="feed-main-container">
            <div className="w-100 h-100 d-flex flex-column">
                <div className="feed-container">
                    {
                        posts?.data?.map((post, index) => (
                            <form className="post-card p-4" key={index}>
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-start">
                                        <FontAwesomeIcon icon={faCircleUser} size="4x"/>
                                        <div className="d-flex flex-column p-2">
                                            <div
                                                className="fw-bold">{post.userData.firstname + ' ' + post.userData.lastname}</div>
                                            <p className="text-muted">{post.title}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column">
                                        {post.description &&
                                        <p className="mb-4">{post.description}</p>}
                                        <img src={post.filePath}
                                             alt="avatar"
                                             className="img-fluid img-size"/>
                                    </div>
                                </div>
                            </form>
                        ))
                    }
                </div>
                <ReactPaginate
                    pageCount={Math.ceil(posts?.total / 6)}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    )
}

export default Home;
