export let primitives = `
    mark Triangle(
        p1: Vector2,
        p2: Vector2,
        p3: Vector2,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        emit [
            { position: p1, color: color },
            { position: p2, color: color },
            { position: p3, color: color }
        ];
    }

    mark Rectangle(
        p1: Vector2,
        p2: Vector2,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        emit [
            { position: Vector2(p1.x, p1.y), color: color },
            { position: Vector2(p2.x, p1.y), color: color },
            { position: Vector2(p2.x, p2.y), color: color }
        ];
        emit [
            { position: Vector2(p1.x, p1.y), color: color },
            { position: Vector2(p1.x, p2.y), color: color },
            { position: Vector2(p2.x, p2.y), color: color }
        ];
    }

    mark OutlinedRectangle(
        p1: Vector2,
        p2: Vector2,
        width: float = 1,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        Rectangle(p1, Vector2(p1.x + width, p2.y - width), color);
        Rectangle(Vector2(p1.x, p2.y - width), Vector2(p2.x - width, p2.y), color);
        Rectangle(Vector2(p1.x + width, p1.y), Vector2(p2.x, p1.y + width), color);
        Rectangle(Vector2(p2.x - width, p1.y + width), p2, color);
    }

    mark Hexagon(
        center: Vector2,
        radius: float,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        for(i in 0..5) {
            let a1 = i / 6.0 * PI * 2.0;
            let a2 = (i + 1) / 6.0 * PI * 2.0;
            let p1 = Vector2(radius * cos(a1), radius * sin(a1));
            let p2 = Vector2(radius * cos(a2), radius * sin(a2));
            emit [
                { position: center + p1, color: color },
                { position: center, color: color },
                { position: center + p2, color: color }
            ];
        }
    }

    mark Circle16(
        center: Vector2,
        radius: float,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        for(i in 0..15) {
            let a1 = i / 16.0 * PI * 2.0;
            let a2 = (i + 1) / 16.0 * PI * 2.0;
            let p1 = Vector2(radius * cos(a1), radius * sin(a1));
            let p2 = Vector2(radius * cos(a2), radius * sin(a2));
            emit [
                { position: center + p1, color: color },
                { position: center, color: color },
                { position: center + p2, color: color }
            ];
        }
    }

    mark Circle(
        center: Vector2,
        radius: float,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        for(i in 0..31) {
            let a1 = i / 32.0 * PI * 2.0;
            let a2 = (i + 1) / 32.0 * PI * 2.0;
            let p1 = Vector2(radius * cos(a1), radius * sin(a1));
            let p2 = Vector2(radius * cos(a2), radius * sin(a2));
            emit [
                { position: center + p1, color: color },
                { position: center, color: color },
                { position: center + p2, color: color }
            ];
        }
    }

    mark Line(
        p1: Vector2,
        p2: Vector2,
        width: float = 1,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        let d = normalize(p2 - p1);
        let t = Vector2(d.y, -d.x) * (width / 2);
        emit [
            { position: p1 + t, color: color },
            { position: p1 - t, color: color },
            { position: p2 + t, color: color }
        ];
        emit [
            { position: p1 - t, color: color },
            { position: p2 - t, color: color },
            { position: p2 + t, color: color }
        ];
    }

    mark Sector2(
        c: Vector2,
        p1: Vector2,
        p2: Vector2,
        color: Color
    ) {
        let pc = c + normalize(p1 + p2 - c - c) * length(p1 - c);
        Triangle(c, p1, pc, color);
        Triangle(c, pc, p2, color);
    }

    mark Sector4(
        c: Vector2,
        p1: Vector2,
        p2: Vector2,
        color: Color
    ) {
        let pc = c + normalize(p1 + p2 - c - c) * length(p1 - c);
        Sector2(c, p1, pc, color);
        Sector2(c, pc, p2, color);
    }

    mark Polyline(
        p: Vector2, p_p: Vector2, p_n: Vector2, p_nn: Vector2,
        width: float,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        let EPS = 1e-5;
        let w = width / 2;
        let d = normalize(p - p_n);
        let n = Vector2(d.y, -d.x);
        let m1: Vector2;
        if(length(p - p_p) < EPS) {
            m1 = n * w;
        } else {
            m1 = normalize(d + normalize(p - p_p)) * w;
        }
        let m2: Vector2;
        if(length(p_n - p_nn) < EPS) {
            m2 = -n * w;
        } else {
            m2 = normalize(normalize(p_n - p_nn) - d) * w;
        }
        let c1a: Vector2;
        let c1b: Vector2;
        let a1: Vector2;
        let a2: Vector2;
        if(dot(m1, n) > 0) {
            c1a = p + m1;
            c1b = p + n * w;
            a2 = c1b;
            a1 = p - m1 * (w / dot(m1, n));
        } else {
            c1a = p + m1;
            c1b = p - n * w;
            a2 = p + m1 * (w / dot(m1, n));
            a1 = c1b;
        }
        let c2a: Vector2;
        let c2b: Vector2;
        let b1: Vector2;
        let b2: Vector2;
        if(dot(m2, n) < 0) {
            c2a = p_n + m2;
            c2b = p_n - n * w;
            b1 = c2b;
            b2 = p_n + m2 * (w / dot(m2, n));
        } else {
            c2a = p_n + m2;
            c2b = p_n + n * w;
            b2 = c2b;
            b1 = p_n - m2 * (w / dot(m2, n));
        }
        emit [
            { position: p, color: color },
            { position: c1a, color: color },
            { position: c1b, color: color }
        ];
        emit [
            { position: p_n, color: color },
            { position: c2a, color: color },
            { position: c2b, color: color }
        ];
        emit [
            { position: p, color: color },
            { position: a1, color: color },
            { position: b1, color: color }
        ];
        emit [
            { position: p, color: color },
            { position: b1, color: color },
            { position: p_n, color: color }
        ];
        emit [
            { position: p, color: color },
            { position: a2, color: color },
            { position: b2, color: color }
        ];
        emit [
            { position: p, color: color },
            { position: b2, color: color },
            { position: p_n, color: color }
        ];
    }

    mark Wedge(
        p1: Vector2 = [ 0, 0 ],
        theta1: float = 0,
        theta2: float = 0,
        length: float = 10,
        width: float = 1,
        color: Color = [ 0, 0, 0, 1 ]
    ) {
        let dTheta = (theta2 - theta1) / 60;
        let dL = length / 60;
        for(i in 0..59) {
            let dThetaA = i * dTheta;
            let dThetaB = (i + 1) * dTheta;
            let thetaA = theta1 + dThetaA;
            let thetaB = theta1 + dThetaB;
            let thetaCenterA = theta1 + dThetaA / 2;
            let thetaCenterB = theta1 + dThetaB / 2;
            let dlA = dL * i;
            let dlB = dL * (i + 1);
            if(dThetaA > 1e-5 || dThetaA < -1e-5) {
                dlA = dlA / dThetaA * 2 * sin(dThetaA / 2);
            }
            if(dThetaB > 1e-5 || dThetaB < -1e-5) {
                dlB = dlB / dThetaB * 2 * sin(dThetaB / 2);
            }
            let pAdvA = Vector2(-sin(thetaCenterA), cos(thetaCenterA)) * dlA;
            let pAdvB = Vector2(-sin(thetaCenterB), cos(thetaCenterB)) * dlB;
            let pA = p1 + pAdvA;
            let pB = p1 + pAdvB;

            let dpA = Vector2(cos(thetaA), sin(thetaA)) * width * 0.5;
            let dpB = Vector2(cos(thetaB), sin(thetaB)) * width * 0.5;

            Triangle(pA + dpA, pB + dpB, pB - dpB, color);
            Triangle(pA + dpA, pB - dpB, pA - dpA, color);
        }
    }
`