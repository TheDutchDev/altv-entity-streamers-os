using AltV.Net.EntitySync;
using AltV.Net.EntitySync.ServerEvent;
using AltV.Net.EntitySync.SpatialPartitions;

namespace AltV.Streamers;

public static class AltStreamers
{
    public static ulong ENTITY_TYPE_MARKER = 0;
    public static ulong ENTITY_TYPE_TEXTLABEL = 1;
    public static ulong ENTITY_TYPE_DYNAMIC_OBJECT = 2;
    public static ulong ENTITY_TYPE_WORLD_OBJECT = 3;
    
    public static void Init()
    {
        AltEntitySync.Init( 8, ( threadId ) => 100, ( threadId ) => false,
            ( threadCount, repository ) => new ServerEventNetworkLayer( threadCount, repository ),
            ( entity, threadCount ) => ( entity.Type ),
            ( entityId, entityType, threadCount ) => ( entityType ),
            //( threadId ) => new LimitedGrid3( 50_000, 50_000, 100, 10_000, 10_000, 300 ),
            ( threadId ) =>
            {
                //THREAD TEXT/MARKER
                if( threadId == ENTITY_TYPE_MARKER || threadId == ENTITY_TYPE_TEXTLABEL )
                {
                    return new LimitedGrid3( 50_000, 50_000, 100, 10_000, 10_000, 500 );
                }
                //THREAD OBJECT
                else if( threadId == ENTITY_TYPE_DYNAMIC_OBJECT )
                {
                    return new LimitedGrid3( 50_000, 50_000, 125, 10_000, 10_000, 400 );
                }

                //THREAD WORLD OBJECT
                else if( threadId == ENTITY_TYPE_WORLD_OBJECT )
                {
                    return new LimitedGrid3( 50_000, 50_000, 125, 10_000, 10_000, 400 );
                }

                else
                {
                    return new LimitedGrid3( 50_000, 50_000, 175, 10_000, 10_000, 300 );
                }
            },
            new IdProvider( )
        );
    }
}