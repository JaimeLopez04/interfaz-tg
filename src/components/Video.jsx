import PropTypes from 'prop-types'

const Thumbnail = ({ video }) => {
    return (
        <div>
            <video className='w-96' src={video.url} autoPlay loop muted controls />
        </div>
    );
};

const Video = ({ video }) => {
    return (
        <div>
            <div className='flex justify-start items-center m-2 p-2 gap-2 max-w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 '>
                <Thumbnail video={video} className="w-80" />
                
                <div className='w-80'>
                    <p className='text-white'>
                        En este momento de la clase, se detecto un cambio significatico en las emociones, obteniendo:
                    </p>
                    <h1 className='text-white font-bold'>
                        {video.dominant_emotion}
                    </h1>
                </div>
            </div>
        </div>
    )
}

Video.propTypes = {
    video: PropTypes.object,
}

Thumbnail.propTypes ={
    video:PropTypes.object,
};

export default Video
