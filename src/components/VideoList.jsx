import Video from './Video';
import PropTypes from 'prop-types'

const VideoList = ({ videos, emptyHeading }) => {
    const count = videos.length;
    let heading = emptyHeading;
    if (count > 0) {
        const noun = count > 1 ? 'videos' : 'video';
        heading = 'Aqui puedes ver ' + count + ' ' + noun + ' de momentos de la clase en los que se evidenciaron emociones negativas en los estudiantes';
    }

    return (
        <section className="h-[75vh] overflow-auto">
            <h2 className='text-white'> {heading} </h2>
            {videos.map(video =>
                <Video key={video.key} video={video} />
            )}
        </section>
    )
}

VideoList.propTypes ={
    videos: PropTypes.arrayOf(PropTypes.object),
    emptyHeading: PropTypes.string
};

// Default props value
VideoList.defaultProps = {
    emptyHeading: "No Videos Found"
};

export default VideoList
